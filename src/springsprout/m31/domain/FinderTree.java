/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 12
 * Time: 오후 5:58:38
 * enjoy springsprout ! development!
 */
package springsprout.m31.domain;

/**
 * spring finder의 tree를 위한 ...
 */
public class FinderTree {
    private Integer id;
    private String text;
    private Boolean leaf = false;
    private String iconCls;
    private Integer parentId;
    private Integer viewOrder;
    private String linkAppId;
    private String fileType;
    private String defaultYn;
    private Boolean singleClickExpand = true;

    public String getDefaultYn() {
        return defaultYn;
    }

    public void setDefaultYn(String defaultYn) {
        this.defaultYn = defaultYn;
        if("Y".equals(defaultYn)){
        }
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
        if(!"F".equals(fileType)){
            leaf= true;
        }
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean isLeaf() {
        return leaf;
    }

    public void setLeaf(Boolean leaf) {
        this.leaf = leaf;
    }

    public String getLinkAppId() {
        return linkAppId;
    }

    public void setLinkAppId(String linkAppId) {
        this.linkAppId = linkAppId;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getViewOrder() {
        return viewOrder;
    }

    public void setViewOrder(Integer viewOrder) {
        this.viewOrder = viewOrder;
    }

    public Boolean isSingleClickExpand() {
        return singleClickExpand;
    }
}
