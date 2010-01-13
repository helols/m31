/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 14
 * Time: 오전 2:39:29
 * enjoy springsprout ! development!
 */
package springsprout.m31.domain;

public class FinderFile {
    private Integer fileId;
    private String fileName;
    private String iconCls;
    private Integer parentId;
    private String defaultYn;
    private String linkAppId;
    private String fileAddition;

    public String getFileAddition() {
        return fileAddition;
    }

    public void setFileAddition(String fileAddition) {
        this.fileAddition = fileAddition;
    }

    public String getLinkAppId() {
        return linkAppId;
    }

    public void setLinkAppId(String linkAppId) {
        this.linkAppId = linkAppId;
    }

    public String getDefaultYn() {
        return defaultYn;
    }

    public void setDefaultYn(String defaultYn) {
        this.defaultYn = defaultYn;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public Integer getFileId() {
        return fileId;
    }

    public void setFileId(Integer fileId) {
        this.fileId = fileId;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}