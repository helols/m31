/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 11:13:44
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import net.sf.json.JSONObject;
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

    @Test
    public void jsonArrayConverToArrayListTest(){
        String jsonString = "{\"channel\":{\"item\":[{\"thumbnail\":\"http://image02.search.daum-img.net/03/0.c3.b6.BL_shopping-how_472_0.jpg\",\"width\":\"520\",\"height\":\"347\",\"cp\":\"7\",\"title\":\"[Daum Life Changers Shopping7]쇼핑하우를 IPTV 속으로 넣어보자!!\",\"image\":\"\",\"link\":\"http://blog.daum.net/shopping-how/472\",\"pubDate\":\"20091203212840\",\"author\":\"8AFQI\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/f.e7.8a.TI_460923862_0.jpg\",\"width\":\"750\",\"height\":\"474\",\"cp\":\"7\",\"title\":\"Daum검색\",\"image\":\"\",\"link\":\"http://lucero.tistory.com/3\",\"pubDate\":\"20090826170811\",\"author\":\"jelldis@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/8.8e.e7.TI_460921295_0.jpg\",\"width\":\"893\",\"height\":\"595\",\"cp\":\"7\",\"title\":\"Daum카페\",\"image\":\"\",\"link\":\"http://lucero.tistory.com/1\",\"pubDate\":\"20090826165238\",\"author\":\"jelldis@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/a.a8.a2.BL_aleedsun_39197_1.jpg\",\"width\":\"899\",\"height\":\"696\",\"cp\":\"7\",\"title\":\"절규\",\"image\":\"\",\"link\":\"http://blog.daum.net/aleedsun/39197\",\"pubDate\":\"20090601203220\",\"author\":\"pOPc\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/b.8e.06.TI_apreview.tistory.com_7_4.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://tsunamis.tistory.com/72\",\"pubDate\":\"20090427135916\",\"author\":\"psw7574@naver.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/1.ff.97.TI_tsunamis.tistory.com_72_4.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://tsunamis.tistory.com/72\",\"pubDate\":\"20090427135916\",\"author\":\"psw7574@naver.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/f.57.4b.TI_imchool.tistory.com_114_0.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://imchool.tistory.com/114\",\"pubDate\":\"20090426231711\",\"author\":\"imchool@gmail.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/d.a2.de.TI_176500_4_0.jpg\",\"width\":\"1024\",\"height\":\"768\",\"cp\":\"7\",\"title\":\"Daum♡\",\"image\":\"\",\"link\":\"http://risyana.tistory.com/4\",\"pubDate\":\"20090208024841\",\"author\":\"risyana@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/f.94.7f.BL_0MdNC_84_1.jpg\",\"width\":\"760\",\"height\":\"315\",\"cp\":\"15\",\"title\":\"daum 지도\",\"image\":\"\",\"link\":\"http://cafe.daum.net/HKKOREAN/4qWC/320?docid=1Db7e|4qWC|320|20090124125921\",\"pubDate\":\"20090124125921\",\"author\":\"4BVxc\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/5.69.b0.CF_1Fpgm_PntS_88_2.jpg\",\"width\":\"600\",\"height\":\"471\",\"cp\":\"15\",\"title\":\"daumpc\",\"image\":\"\",\"link\":\"http://cafe.daum.net/DaumPC/PntS/88?docid=1Fpgm|PntS|88|20081224212859\",\"pubDate\":\"20081224212859\",\"author\":\"4onQk\"}],\"sort\":\"1\",\"title\":\"Search image Daum Open API\",\"result\":\"10\",\"totalCount\":51876,\"pageno\":\"1\",\"q\":\"daum\",\"desc\":\"Daum Open API search result\"}}";
        String itemString = "[{\"thumbnail\":\"http://image02.search.daum-img.net/03/0.c3.b6.BL_shopping-how_472_0.jpg\",\"width\":\"520\",\"height\":\"347\",\"cp\":\"7\",\"title\":\"[Daum Life Changers Shopping7]쇼핑하우를 IPTV 속으로 넣어보자!!\",\"image\":\"\",\"link\":\"http://blog.daum.net/shopping-how/472\",\"pubDate\":\"20091203212840\",\"author\":\"8AFQI\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/f.e7.8a.TI_460923862_0.jpg\",\"width\":\"750\",\"height\":\"474\",\"cp\":\"7\",\"title\":\"Daum검색\",\"image\":\"\",\"link\":\"http://lucero.tistory.com/3\",\"pubDate\":\"20090826170811\",\"author\":\"jelldis@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/8.8e.e7.TI_460921295_0.jpg\",\"width\":\"893\",\"height\":\"595\",\"cp\":\"7\",\"title\":\"Daum카페\",\"image\":\"\",\"link\":\"http://lucero.tistory.com/1\",\"pubDate\":\"20090826165238\",\"author\":\"jelldis@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/a.a8.a2.BL_aleedsun_39197_1.jpg\",\"width\":\"899\",\"height\":\"696\",\"cp\":\"7\",\"title\":\"절규\",\"image\":\"\",\"link\":\"http://blog.daum.net/aleedsun/39197\",\"pubDate\":\"20090601203220\",\"author\":\"pOPc\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/b.8e.06.TI_apreview.tistory.com_7_4.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://tsunamis.tistory.com/72\",\"pubDate\":\"20090427135916\",\"author\":\"psw7574@naver.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/1.ff.97.TI_tsunamis.tistory.com_72_4.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://tsunamis.tistory.com/72\",\"pubDate\":\"20090427135916\",\"author\":\"psw7574@naver.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/f.57.4b.TI_imchool.tistory.com_114_0.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://imchool.tistory.com/114\",\"pubDate\":\"20090426231711\",\"author\":\"imchool@gmail.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/d.a2.de.TI_176500_4_0.jpg\",\"width\":\"1024\",\"height\":\"768\",\"cp\":\"7\",\"title\":\"Daum♡\",\"image\":\"\",\"link\":\"http://risyana.tistory.com/4\",\"pubDate\":\"20090208024841\",\"author\":\"risyana@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/f.94.7f.BL_0MdNC_84_1.jpg\",\"width\":\"760\",\"height\":\"315\",\"cp\":\"15\",\"title\":\"daum 지도\",\"image\":\"\",\"link\":\"http://cafe.daum.net/HKKOREAN/4qWC/320?docid=1Db7e|4qWC|320|20090124125921\",\"pubDate\":\"20090124125921\",\"author\":\"4BVxc\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/5.69.b0.CF_1Fpgm_PntS_88_2.jpg\",\"width\":\"600\",\"height\":\"471\",\"cp\":\"15\",\"title\":\"daumpc\",\"image\":\"\",\"link\":\"http://cafe.daum.net/DaumPC/PntS/88?docid=1Fpgm|PntS|88|20081224212859\",\"pubDate\":\"20081224212859\",\"author\":\"4onQk\"}]";
        Object obj = JSONObject.fromObject(JSONObject.fromObject(jsonString).get("channel")).get("item");

        assertThat(obj.toString(),is(itemString));

        ArrayList<HashMap<String,String>> r_list = new ArrayList<HashMap<String, String>>();
        JSONHelper.jsonArrayConverToArrayList(r_list,jsonString,"channel.item");

        assertThat(r_list.get(0).get("thumbnail"),is("http://image02.search.daum-img.net/03/0.c3.b6.BL_shopping-how_472_0.jpg"));
        assertThat(r_list.get(9).get("pubDate"),is("20081224212859"));
    }

}
