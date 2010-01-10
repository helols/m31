/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:33:28
 * enjoy springsprout ! development!
 */
package springsprout.m31.domain;

public class DeskTopAdditionInfo {

    private Integer id;
    private Integer memberId;
    /**
     * 3종류의 ID로 구분.
     */
    private String deskTopThemeId;

    /**
     * RGB 코드
     */
    private String deskTopBKcolor;
    /**
     * img src...
     */
    private String deskTopBKImgSrc;

    /**
     * 이미지 포지션.. 총 9가지 경우의 수.  세로/가로
     * 세로 :  top, center, bottom
     * 가로 : left, center, right
     * 조합. tl,tc,tr,cl,cc,cr,bl,bc,br
     */
    private String deskTopBKImgPosition;
    /**
     * 이미지 반복여부 . 총 4가지.
     * r(자동반복 xy), rx , ry , nr(반복하지 않음)
     */
    private String deskTopBKImgRepeat;

    public String getDeskTopBKcolor() {
        return deskTopBKcolor;
    }

    public void setDeskTopBKcolor(String deskTopBKcolor) {
        this.deskTopBKcolor = deskTopBKcolor;
    }

    public String getDeskTopBKImgPosition() {
        return deskTopBKImgPosition;
    }

    public void setDeskTopBKImgPosition(String deskTopBKImgPosition) {
        this.deskTopBKImgPosition = deskTopBKImgPosition;
    }

    public String getDeskTopBKImgSrc() {
        return deskTopBKImgSrc;
    }

    public void setDeskTopBKImgSrc(String deskTopBKImgSrc) {
        this.deskTopBKImgSrc = deskTopBKImgSrc;
    }

    public String getDeskTopThemeId() {
        return deskTopThemeId;
    }

    public void setDeskTopThemeId(String deskTopThemeId) {
        this.deskTopThemeId = deskTopThemeId;
    }

    public String getDeskTopBKImgRepeat() {
        return deskTopBKImgRepeat;
    }

    public void setDeskTopBKImgRepeat(String deskTopBKImgRepeat) {
        this.deskTopBKImgRepeat = deskTopBKImgRepeat;
    }

    public Integer getMemberId() {
        return memberId;
    }

    public void setMemberId(Integer memberId) {
        this.memberId = memberId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
