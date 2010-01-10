/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 10
 * Time: 오전 11:35:47
 * enjoy springsprout ! development!
 */
package springsprout.m31.dto;

public class SignupDTO {
    private String j_username;
    private String j_password;
    private String j_nickname;
    private Integer j_memberId;

    public String getJ_nickname() {
        return j_nickname;
    }

    public void setJ_nickname(String j_nickname) {
        this.j_nickname = j_nickname;
    }

    public String getJ_password() {
        return j_password;
    }

    public void setJ_password(String j_password) {
        this.j_password = j_password;
    }

    public String getJ_username() {
        return j_username;
    }

    public void setJ_username(String j_username) {
        this.j_username = j_username;
    }

    public Integer getJ_memberId() {
        return j_memberId;
    }

    public void setJ_memberId(Integer j_memberId) {
        this.j_memberId = j_memberId;
    }
}
