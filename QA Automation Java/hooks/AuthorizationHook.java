import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

import static HeaderConstants.ADMIN_TOKEN;

public class AuthorizationHook {

    @Before(order = 1)
    public void prepareBearerToken(final Scenario scenario) {
        ScenarioStorage.currentScenarioName = scenario.getName();
        
        if (TokenStorage.getSavedToken(ADMIN_TOKEN) == null) {
            Token unverifiedToken = TokenHelper.getUnverifiedTokenViaLoginRequest(LoginRequestFactory.getAdminLoginRequest());
            Token verifiedToken = TokenHelper.getVerifiedToken(unverifiedToken);
            TokenStorage.saveToken(ADMIN_TOKEN, verifiedToken);
        }
    }

}
