import com.codeborne.selenide.*;
import com.codeborne.selenide.files.FileFilter;
import io.automation.selenide.Page;
import org.openqa.selenium.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.Duration;

import static com.codeborne.selenide.Selenide.$x;

public interface BasePage {
    Logger LOGGER = LoggerFactory.getLogger(Page.class);

    SelenideElement PACE = $x("//body[contains(@class, 'pace-running')]");

    static <T> T at(Class<T> tClass) {
        return Selenide.page(tClass);
    }

    static SelenideElement assertCondition(SelenideElement element, Condition condition, Duration duration) {
        LOGGER.debug("WebElement: {} should have the follow conditions: {}", element, condition);
        return element.shouldBe(condition, duration);
    }

    static ElementsCollection assertCondition(ElementsCollection elements, CollectionCondition condition, Duration duration) {
        LOGGER.debug("WebElement Collection: {} should have the follow conditions: {}", elements, condition);
        return elements.shouldBe(condition, duration);
    }

    static void waitForLoadingPaceVisible() {
        try {
            PACE.should(Condition.appear);
        } catch (com.codeborne.selenide.ex.ElementNotFound | com.codeborne.selenide.ex.ElementShould |
                 NoSuchElementException ex) {
            LOGGER.warn("Pace isn't exist");
        }
    }

    default File download(SelenideElement element, FileFilter filter) {
        File file = null;
        try {
            file = element.download(filter);
        } catch (FileNotFoundException e) {
            LOGGER.error("No file by clicking on WebElement {} {}", element, filter.description());
        }
        return file;
    }
    
    default void setValueWhenEnabled(SelenideElement element, String value, Duration duration) {
        isClickable(element, duration).setValue(value);
    }
}