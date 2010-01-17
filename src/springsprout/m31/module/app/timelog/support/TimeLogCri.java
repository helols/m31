package springsprout.m31.module.app.timelog.support;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 16
 * Time: 오후 6:38:13
 * To change this template use File | Settings | File Templates.
 */
public class TimeLogCri {
    private int memberID;
    private String regDate;

    public int getMemberID() {
        return memberID;
    }

    public void setMemberID(int memberID) {
        this.memberID = memberID;
    }

    public String getRegDate() {
        return regDate;
    }

    public void setRegDate(String regDate) {
        this.regDate = regDate;
    }

    @Override
    public String toString() {
        return "TimeLogCri{" +
                "memberID=" + memberID +
                ", regDate='" + regDate + '\'' +
                '}';
    }
}
