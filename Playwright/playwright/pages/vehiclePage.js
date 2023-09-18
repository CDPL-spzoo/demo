import { BasePage } from './base-page';

const tableRow = '.ListRow';
const rowColumn = '.ListRow-column';
const noResultsContainer = '.ListArray-emptyContainer';
const option = '[role="option"]';
const filterDropdown = '.InputDropdown';
const searchBar = '.ListVehicles .ListVehicles-search';

const placeholders = {
    Fleet: {
        'en-US': 'Fleet',
        'fr-FR': 'Flotte'
    },
    Company: {
        'en-US': 'Company',
        'fr-FR': 'Entreprise'
    }
};

export class VehiclePage extends BasePage {
    getSearchBar = () => this.page.locator(searchBar);
    getSearchField = () => this.page.getByRole('searchbox', { name: /VIN, / });
    typeInSearchField = (text) => this.getSearchField().type(text);
    getListOfResultRows = () => this.page.locator(`${tableRow}:not(.ListRow--withTitle)`);
    getHeaderRow = () => this.page.locator(tableRow).first();
    getAllHeaders = () => this.getHeaderRow().locator(rowColumn);
    getRowByIndex = (index) => this.getListOfResultRows().nth(index);
    getValueByRowIndex = async (columnName, rowIndex) => {
        columnName = (placeholders[columnName]) ? placeholders[columnName][this.locale] : columnName;
        let headerIndex;
        const headers = await this.getHeaderRow().locator(rowColumn);
        for(let i = 0; i < await headers.count(); i++) {
            if (await headers.nth(i).locator(`span:has-text("${columnName}")`).count()) {
                headerIndex = i;
                break;
            }
        }
        return await this.getRowByIndex(rowIndex).locator(`${rowColumn} >> nth=${headerIndex}`);
    };
    getHeaderIndex = async (columnName) => {
        columnName = (placeholders[columnName]) ? placeholders[columnName][this.locale] : columnName;
        let headerIndex = 0;
        for (const header of await this.getHeaderRow().locator(rowColumn).all()) {
            if (await header.innerText() === columnName) break;
            headerIndex ++;
        }
        return headerIndex;
    };
    getValueInRowByColumn = async (row, columnName) =>
        await row.locator(`${rowColumn} >> nth=${await this.getHeaderIndex(columnName)}`);
    getAllColumnResults =  async (columnName) => {
        const headerIndex =  await this.getHeaderIndex(columnName);
        const results =  await this.getListOfResultRows().locator(`${rowColumn}:nth-child(${await headerIndex + 1})`);
        return await results.all();
    };
    getNoResultsContainer = () => this.page.locator(noResultsContainer);
    getAdvancedSearchButton = () => {
        const button = this.locale === 'fr-FR' ? 'Recherche Avancée' : 'Advanced search';
        return this.page.locator(`button:has-text('${button}'):visible`);
    };
    clickAdvancedSearchButton = () => this.getAdvancedSearchButton().click();
    getBasicSearchButton = () => {
        const button = this.locale === 'fr-FR' ? 'Recherche de base' : 'Basic search';
        return this.page.locator(`button:has-text('${button}'):visible`);
    };
    clickBasicSearchButton = () => this.getAdvancedSearchButton().click();
    getFilterInputByPlaceholder = (placeholder) => {
        const value = (placeholders[placeholder]) ? placeholders[placeholder][this.locale] : placeholder;
        return this.page.getByRole('textbox', { name: value });
    };
    typeInSearchInputByPlaceholder = (placeholder, text) => this.getFilterInputByPlaceholder(placeholder).type(text);
    getOptionByText = (text) => this.page.locator(`${option}:text-is("${text}")`);
    clickOptionByText = (text) => this.getOptionByText(text).click();
    clickThreeDotButton = () => this.page.getByRole('button', { name: 'Options' }).click();
    getColumnFilterCheckboxByText = (text) => {
        text = (placeholders[text]) ? placeholders[text][this.locale] : text;
        return this.page.locator(`.ActionsButton-action:text-is("${text}") >> input`);
    };
    checkColumnFilterByText = (text) => this.getColumnFilterCheckboxByText(text).click();
    getFilterDropdownByPlaceholder = (placeholder) =>
        this.page.locator(`${filterDropdown} button:has-text("${placeholder}")`);
    clickFilterDropdownByPlaceholder = (placeholder) => this.getFilterDropdownByPlaceholder(placeholder).click();


    //pagination
    nextPage = (this.locale === 'fr-FR') ? '[aria-label="Page suivante"]' : '[aria-label="Next page"]';
    getNextPageButton = () => this.page.locator(this.nextPage);
    getDisabledNextButton = () => this.page.locator(`${this.nextPage}.Pagination-arrow--inactive`);
    clickNextPageButton = () => this.getNextPageButton().click();

    useForAllPages = async (logic) => {
        await this.waitForSpinner();
        await logic();
        if (await this.getNextPageButton().count()) {
            while(!await this.getDisabledNextButton().count()) {
                await this.clickNextPageButton();
                await this.waitForSpinner();
                await logic();
            }
        }
    };
}
