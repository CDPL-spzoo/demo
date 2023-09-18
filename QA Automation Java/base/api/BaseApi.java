import io.restassured.http.Method;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

import static java.lang.Thread.currentThread;
import static java.lang.Thread.sleep;
import static java.util.concurrent.TimeUnit.MILLISECONDS;

public class BaseApi {

    static Logger LOGGER = LoggerFactory.getLogger(Api.class);

    public static <T> T doGetUntilSucceeded(RequestSpecification spec, Class<T> clazz) {
        return doGetUntilSucceeded(spec).as(clazz);
    }

    public static Response doGet(RequestSpecification request) {
        return doRequest(request, Method.GET, 1);
    }

    public static Response doGetUntilSucceeded(RequestSpecification request) {
        return doRequest(request, Method.GET, 3);
    }

    private static Response doRequest(RequestSpecification request, Method requestMethod, int attempts) {
        Response response = null;

        for (int i = 1; i <= attempts; i++) {
            response = doRequest(request, requestMethod);
            final int actualStatusCode = response.getStatusCode();
            try {
                if (actualStatusCode >= HttpStatus.SC_OK && actualStatusCode <= HttpStatus.SC_PARTIAL_CONTENT) {
                    LOGGER.info("Request {} - status code {}", requestMethod, actualStatusCode);
                    return response;
                } else if (i != attempts) {
                    LOGGER.warn("Request {} - status code {} - attempt number {}", requestMethod, actualStatusCode, i);
                    sleep(MILLISECONDS.convert(Duration.ofSeconds(5)));
                } else {
                    throw new HttpResponseException(actualStatusCode, String.format("%s request failed because %s",
                            requestMethod, response.getBody().prettyPrint()));
                }
            } catch (InterruptedException e) {
                LOGGER.error(e.getMessage(), e);
                currentThread().interrupt();
            } catch (HttpResponseException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }
        return response;
    }
}
