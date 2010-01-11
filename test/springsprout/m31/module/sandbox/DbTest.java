/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 1:32:48
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.sandbox;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.dto.SignupDTO;
import springsprout.m31.module.member.MemberRepository;

import java.util.Arrays;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/testContext.xml")
@Transactional
public class DbTest {
    @Autowired
    MemberRepository memberRepository;

    @Rollback(true)
    @Test public void dbConnectTest(){
        Assert.assertNotNull(memberRepository.getMemberByEmail("helolsjava@gmail.com"));
    }

    @Rollback(true)
    @Test public void signupTest(){
        SignupDTO s = new SignupDTO();
        s.setJ_password("abc");
        s.setJ_username("h@nam");
        s.setJ_nickname("야호");
        Integer id = memberRepository.signup(s);
        System.out.println("id>>"+ id);
        Assert.assertNotNull(id);
    }

    @Rollback(true)
    @Test public void makeMemberInfoTest(){
        List user = Arrays.asList(new String[]{"helolsjava@gmail.com","adovoba@naver.com"});
        Assert.assertNotNull(memberRepository.makeMemberInfo(user).get(0));
    }
}
