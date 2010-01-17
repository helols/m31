package springsprout.m31.domain;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 16
 * Time: 오후 1:55:09
 * To change this template use File | Settings | File Templates.
 */
public class ThingVO {
    int id;
    int viewOrder;
    String thing;
    int memberID;

    public int getMemberID() {
        return memberID;
    }

    public void setMemberID(int memberID) {
        this.memberID = memberID;
    }

    public int getViewOrder() {
        return viewOrder;
    }

    public void setViewOrder(int viewOrder) {
        this.viewOrder = viewOrder;
    }

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
}
