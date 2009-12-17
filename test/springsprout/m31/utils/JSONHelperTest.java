/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 11:13:44
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import springsprout.m31.domain.Member;

import java.util.ArrayList;
import java.util.HashMap;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class JSONHelperTest {
    public Member helols;
    public Member miracle;
    public Member outsider;

    @Before
    public void setUp() {
        helols = new Member();
        miracle = new Member();
        outsider = new Member();

        helols.setId(1);
        helols.setEmail("helolsjava@gmail.com");
        helols.setName("is윤군");

        miracle.setId(2);
        miracle.setEmail("miracle0k@gmail.com");
        miracle.setName("기적실장님");

        outsider.setId(3);
        outsider.setEmail("outsider@gmail.com");
        outsider.setName("외도팀장님");
    }

    @Test
    public void listToJSONstr() {
        ArrayList<Member> memberList = new ArrayList<Member>();
        memberList.add(helols);
        memberList.add(miracle);
        memberList.add(outsider);

        String jsonString = "{\"memberList\":[" +
                "{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}" +
                ",{\"email\":\"miracle0k@gmail.com\",\"id\":2,\"name\":\"기적실장님\"}" +
                ",{\"email\":\"outsider@gmail.com\",\"id\":3,\"name\":\"외도팀장님\"}" +
                "]}";

        Assert.assertThat(JSONHelper.listToJSONstr(memberList, "memberList"), is(jsonString));
    }

    @Test
    public void domainToJSONstr() {
        String jsonString = "{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}";
        Assert.assertThat(JSONHelper.domainToJSONstr(helols), is(jsonString));
    }

    @Test
    public void mapInSingleToJSONstr() {
        HashMap map = new HashMap<String, Member>();
        map.put("helols", helols);
        map.put("miracle", miracle);
        map.put("outsider", outsider);

        String jsonString = "{" +
                "\"miracle\":{\"email\":\"miracle0k@gmail.com\",\"id\":2,\"name\":\"기적실장님\"}," +
                "\"outsider\":{\"email\":\"outsider@gmail.com\",\"id\":3,\"name\":\"외도팀장님\"}," +
                "\"helols\":{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}" +
                "}";

        Assert.assertThat(JSONHelper.mapInSingleToJSONstr(map), is(jsonString));
    }

    @Test
    public void mapInListToJSONstr() {
        ArrayList<Member> memberList = new ArrayList<Member>();
        memberList.add(helols);
        memberList.add(miracle);
        memberList.add(outsider);
        HashMap map = new HashMap<String, Member>();
        map.put("helols", memberList);
        map.put("miracle", memberList);
        map.put("outsider", memberList);

        String jsonString = "{" +
                "\"miracle\":[{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}" +
                ",{\"email\":\"miracle0k@gmail.com\",\"id\":2,\"name\":\"기적실장님\"}" +
                ",{\"email\":\"outsider@gmail.com\",\"id\":3,\"name\":\"외도팀장님\"}]," +
                "\"outsider\":[{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}" +
                ",{\"email\":\"miracle0k@gmail.com\",\"id\":2,\"name\":\"기적실장님\"}" +
                ",{\"email\":\"outsider@gmail.com\",\"id\":3,\"name\":\"외도팀장님\"}]," +
                "\"helols\":[{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}" +
                ",{\"email\":\"miracle0k@gmail.com\",\"id\":2,\"name\":\"기적실장님\"}" +
                ",{\"email\":\"outsider@gmail.com\",\"id\":3,\"name\":\"외도팀장님\"}]" +
                "}";

        assertThat(JSONHelper.mapInListToJSONstr(map), is(jsonString));
    }

    @Test
    public void toBean() {
        String jsonString = "{\"email\":\"helolsjava@gmail.com\",\"id\":1,\"name\":\"is윤군\"}";
        assertThat(JSONHelper.covertHashMap(jsonString).get("email").toString(), is("helolsjava@gmail.com"));
    }

}
