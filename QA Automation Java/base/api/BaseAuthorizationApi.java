import com.fasterxml.jackson.databind.node.ObjectNode;
import io.restassured.specification.RequestSpecification;

public class BaseAuthorizationApi {
    public Token getToken(String userEmail, String userPassword) {
        ObjectNode login = JacksonUtils.createJsonNode()
                .put("email", userEmail)
                .put("password", userPassword);
        RequestSpecification request = getRequestSpecification()
                .baseUri(BASE_URL).basePath(LOGIN)
                .body(login);
        return doPost(request).as(Token.class);
    }
}
