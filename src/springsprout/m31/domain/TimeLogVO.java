package springsprout.m31.domain;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 16
 * Time: 오후 1:55:42
 * To change this template use File | Settings | File Templates.
 *                    
 */
public class TimeLogVO {
    private int id;
    private String thing;
    private String regDate;
    private int memberID;
    private int thingID;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getThing() {
        return thing;
    }

    public void setThing(String thing) {
        this.thing = thing;
    }

    public String getRegDate() {
        return regDate;
    }

    public void setRegDate(String regDate) {
        this.regDate = regDate;
    }

    public int getMemberID() {
        return memberID;
    }

    public void setMemberID(int memberID) {
        this.memberID = memberID;
    }

    public int getThingID() {
        return thingID;
    }

    public void setThingID(int thingID) {
        this.thingID = thingID;
    }

    @Override
    public String toString() {
        return "TimeLogVO{" +
                "thing='" + thing + '\'' +
                ", regDate='" + regDate + '\'' +
                ", memberID=" + memberID +
                ", thingID=" + thingID +
                '}';
    }
}
