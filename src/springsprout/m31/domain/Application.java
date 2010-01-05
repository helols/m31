/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 18
 * Time: 오전 1:59:54
 * enjoy springsprout ! development!
 */
package springsprout.m31.domain;

public class Application {
    private Integer id;
    private String appName;
    private String appId;
    private String appDesc;
    private String appInstallYn;
    private Integer appOrder;

    public String getAppDesc() {
        return appDesc;
    }

    public void setAppDesc(String appDesc) {
        this.appDesc = appDesc;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;        
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAppInstallYn() {
        return appInstallYn;
    }

    public void setAppInstallYn(String appInstallYn) {
        this.appInstallYn = appInstallYn;
    }

    public Integer getAppOrder() {
        return appOrder;
    }

    public void setAppOrder(Integer appOrder) {
        this.appOrder = appOrder;
    }
}
