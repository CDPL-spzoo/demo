package io.automation;

public class ApiModelUserCreds {

    private String id;
    private String login;
    private String password;

    public ApiModelUserCreds(String id, String login, String password) {
        this.id = id;
        this.login = login;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public ApiModelUserCreds setId(String id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public ApiModelUserCreds setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public ApiModelUserCreds setPassword(String password) {
        this.password = password;
        return this;
    }
}
