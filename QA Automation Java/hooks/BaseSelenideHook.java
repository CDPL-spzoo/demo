import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.FileDownloadMode;
import com.codeborne.selenide.logevents.SelenideLogger;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.qameta.allure.selenide.AllureSelenide;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

public class BaseSelenideHook {

    private static final Logger LOGGER = LoggerFactory.getLogger(SelenideHook.class);
    private static final String path = Paths.get("src/test/resources/test_data/downloads").toAbsolutePath().toString();

    private static final String BROWSER_SIZE = System.getProperty("browser.resolution", "1920x1080");
    private static final String BROWSER_NAME = System.getProperty("browser", "chrome");

    private static final String SELENOID_REMOTE = System.getProperty("selenoid.remote", "http://127.0.0.1:4444/wd/hub");
    private static final boolean SELENOID_VIDEO = Boolean.parseBoolean(System.getProperty("selenoid.video", "false"));
    private static final boolean SELENOID = Boolean.parseBoolean(System.getProperty("selenoid.enable", "false"));

    @Before(order = 0)
    public void prepareSelenoidConfig(final Scenario scenario) {
        DesiredCapabilities capabilities = defaultOrAny();
        Map<String, Object> selenoidOptions = Map.of(
                "videoName", formatVideoName(scenario),
                "enableVideo", SELENOID_VIDEO,
                "sessionTimeout", "3m",
                "enableVNC", true,
                "enableLog", true
        );
        capabilities.setCapability("selenoid:options", selenoidOptions);
        Configuration.remote = SELENOID ? SELENOID_REMOTE : null;
        Configuration.headless = false;
        Configuration.browser = BROWSER_NAME;
        Configuration.browserSize = BROWSER_SIZE;
        Configuration.browserVersion = setArmOrDefault();
        Configuration.browserCapabilities = capabilities;
        Configuration.fileDownload = FileDownloadMode.FOLDER;
        Configuration.downloadsFolder = path;
        Configuration.pageLoadTimeout = TimeUnit.MILLISECONDS.convert(Durations.QUARTER_TO_MIN, TimeUnit.SECONDS);
        Configuration.timeout = TimeUnit.MILLISECONDS.convert(Durations.QUARTER_OF_MIN, TimeUnit.SECONDS);
        SelenideLogger.addListener("allure", new AllureSelenide());
    }

    private DesiredCapabilities setChromeCapabilities() {
        LOGGER.info("Set capabilities for ChromeDriver");
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.PERFORMANCE, Level.ALL);
        logPrefs.enable(LogType.PROFILER, Level.ALL);
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        logPrefs.enable(LogType.DRIVER, Level.ALL);
        logPrefs.enable(LogType.CLIENT, Level.ALL);
        logPrefs.enable(LogType.SERVER, Level.ALL);

        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--disable-dev-shm-usage");
        chromeOptions.addArguments("--remote-allow-origins=*");

        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability(ChromeOptions.LOGGING_PREFS, logPrefs);
        capabilities.setCapability(ChromeOptions.CAPABILITY, chromeOptions);
        return capabilities;
    }
}
