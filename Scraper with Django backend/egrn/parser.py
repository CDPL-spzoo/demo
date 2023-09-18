import random
import os.path
import requests
import json
from time import sleep
import logging
from dotenv import load_dotenv


API_URL = 'https://egr.gov.by/egrmobile/api/v1/extracts'
API_URL_SWAGGER = 'https://egr.gov.by/api/v2/egr'
API_URL_APP = 'http:///api'
logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)  # Устанавливаем уровень обработчика
logger.addHandler(console_handler)
proxy = {
    'http': '',
    'https': ''}

with open('./user_agents.json', 'r') as agents:
    user_agents = json.load(agents)


def get_random_user_agent():
    return random.choice(user_agents)


def check_ip():
    ip = requests.get('https://checkip.info',
                      headers={'Accept': 'application/json', 'user-agent': get_random_user_agent()},
                      proxies=proxy)
    return ip.json()


def get_pans_by_states(states: list[int]):
    all_items = []
    for i in states:
        success = False
        while not success:
            try:
                sleep(2)
                logger.debug(msg='getting pans')
                res_by_state = requests.get(API_URL_SWAGGER + f'/getRegNumByState/{i}',
                                            verify=False,
                                            proxies=proxy,
                                            headers={'user-agent': get_random_user_agent()},
                                            timeout=60
                                            )
                print(res_by_state.status_code)
                all_items += res_by_state.json()
                success = True
            except requests.exceptions.Timeout:
                logger.debug('get pans timeout retry')
            except requests.exceptions.ChunkedEncodingError:
                logger.debug('chunk encoding retry')
            except requests.exceptions.ConnectionError:
                logger.debug('connection error retry')
    egrn_list = list(map(lambda x: x.get('ngrn'), all_items))
    return egrn_list


def get_common_info(pan: int, timeout=6):
    res = requests.get(API_URL + f'/commonInfo',
                       params={'pan': pan},
                       verify=False,
                       proxies=proxy,
                       headers={'user-agent': get_random_user_agent()},
                       timeout=timeout
                       )

    main_activity = requests.get(API_URL + f'/mainActivity',
                                 params={'pan': pan},
                                 verify=False,
                                 proxies=proxy,
                                 headers={'user-agent': get_random_user_agent()},
                                 timeout=timeout
                                 )

    location = requests.get(API_URL + f'/placeLocation',
                            params={'pan': pan},
                            verify=False,
                            proxies=proxy,
                            headers={'user-agent': get_random_user_agent()},
                            timeout=timeout
                            )
    if location.status_code == 500 or main_activity.status_code == 500 or res.status_code == 500:
        logger.debug(f'get info server error, pan={pan}')
        return None
    try:
        if main_activity.content:
            activity = main_activity.json()
        else:
            activity = {}
    except requests.exceptions.JSONDecodeError:
        activity = {}
    except:
        activity = {}
    try:
        info = res.json()
    except:
        logger.debug(res.text)
        return None

    return {**info, **activity, **{"reg_location": location.text}}


def get_db_pans(api_session):
    res = api_session.post(f"{API_URL_APP}/entity/pans/")
    return res.json()


def map_entity_to_db_model(entity):
    if entity.get('dateOfStateRegistration'):
        dict_to_post = {
            "full_name": entity.get('fullNameRus'),
            "fio": entity.get('fio'),
            "pan": entity.get('unn'),
            "email": entity.get('email'),
            "phone": entity.get('phone_number'),
            "state": entity.get('state'),
            "registration_authority": entity.get('nameOrgRegForDateCreateStatment'),
            "registration_place": entity.get('reg_location'),
            "registration_date": entity.get('dateOfStateRegistration'),
            "last_event_date": entity.get('dateLastEvent'),
            "short_name": entity.get('shortNameRus'),
            "full_name_bel": entity.get('fullNameBel'),
            "short_name_bel": entity.get('shortNameBel'),
            "activity_name": entity.get('nameActivity'),
            "activity_code": entity.get('code')
        }
        return dict_to_post
    else:
        logger.debug('invalid entity')
        return {}


def push_entity_to_db(api_session, entity):
    modified_entity = map_entity_to_db_model(entity)
    success = False
    times = 0
    while not success and times < 3:
        try:
            res = api_session.post(f"{API_URL_APP}/entity/", json=modified_entity,
                                   headers={
                                        'Content-Type': 'application/json',
                                        'accept': 'application/json',
                                    })
            logger.debug(res.json())
            logger.debug(f'{res.json().get("pan")} pushed to db')
            success = True
        except Exception as er:
            sleep(2)
            logger.debug(er)
            times += 1
    if times >= 3:
        logger.debug(f'faild to push \n {res.text}, \n entity - {entity}, modified - {modified_entity}')


def main():
    load_dotenv('../.env')
    api_session = requests.Session()
    api_session.auth = (os.getenv('SUPERUSER'), os.getenv('SUPERUSER_PASSWORD'))
    pans = get_pans_by_states([1])
    logger.debug(f'egrn pans - {len(pans)}')
    db_pans = get_db_pans(api_session)
    logger.debug(f"db pans - {len(db_pans)}")
    pans = [int(x) for x in pans if int(x) not in db_pans]
    logger.debug(f"pans after filtration {len(pans)}")
    # pan parsing
    i = 0
    for pan in pans:
        success = False
        while not success:
            try:
                sleep(2)
                entity = get_common_info(pan, timeout=6)
                success = True
            except requests.exceptions.Timeout:
                logger.debug('timeout')
            except requests.exceptions.ChunkedEncodingError:
                logger.debug('chunk encoding retry')
            except requests.exceptions.ConnectionError:
                logger.debug('connection error retry')
        if entity:
            push_entity_to_db(api_session, entity)
        i += 1


if __name__ == "__main__":
    main()
