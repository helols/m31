/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 2:17:28
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/testContext.xml")
public class OpenApiRequestHelperTest {
    @Autowired
    OpenApiRequestHelper openApiRequestHelper;

    @Test
    public void testLoadApi() throws Exception {
        String naverUrl = "http://openapi.naver.com/search?key=b020ac68a52b2089aae394e4ec7bff2d&target=rank&query=nexearch";
        String daumUrl = "http://apis.daum.net/search/image?q=dog&apikey=d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c&output=json";

        assertThat(openApiRequestHelper.loadApi(naverUrl), is(notNullValue()));
        String reJson = "{\"channel\":{\"item\":[{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/b/ca/70/BL_0ArtX_14717490_10.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717490\",\"pubDate\":\"20080123225718\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/e/5f/02/BL_0ArtX_14717583_8.jpg\",\"width\":\"800\",\"height\":\"600\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717583\",\"pubDate\":\"20080123230559\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/9/1e/82/BL_0ArtX_14718500_0.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14718500\",\"pubDate\":\"20080124004123\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/e/6e/91/BL_0ArtX_14718500_14.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14718500\",\"pubDate\":\"20080124004123\",\"author\":\"To2\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/4.5a.69.CF_sfVa_2jc9_460_3.jpg\",\"width\":\"720\",\"height\":\"480\",\"cp\":\"15\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://cafe.daum.net/bytal1/2Ts9/601?docid=sfVa|2Ts9|601|20091119115940\",\"pubDate\":\"20091119115940\",\"author\":\"2nSxW\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/1.08.02.TI_388491874_2.gif\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://domi9.tistory.com/90\",\"pubDate\":\"20090319124737\",\"author\":\"domi9@hanmail.net\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/0/4d/f0/BL_0ArtX_14717490_0.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717490\",\"pubDate\":\"20080123225718\",\"author\":\"To2\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/5.6b.1e.TI_19720_169_0.jpg\",\"width\":\"800\",\"height\":\"536\",\"cp\":\"7\",\"title\":\"DOG\",\"image\":\"\",\"link\":\"http://camelo.tistory.com/169\",\"pubDate\":\"20090215214641\",\"author\":\"mean9@nate.com\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/4/e4/0f/BL_0ArtX_14717490_18.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717490\",\"pubDate\":\"20080123225718\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img07/7/71/7f/PR_lovewe73_6094766_0.jpg\",\"width\":\"866\",\"height\":\"593\",\"cp\":\"21\",\"title\":\"Dog\",\"image\":\"\",\"link\":\"http://pudding.paran.com/lovewe73/6094766\",\"pubDate\":\"20080911161914\",\"author\":\"\"}],\"sort\":\"1\",\"title\":\"Search image Daum Open API\",\"result\":\"10\",\"totalCount\":7779,\"pageno\":\"1\",\"q\":\"dog\",\"desc\":\"Daum Open API search result\"}}";
        assertThat(openApiRequestHelper.loadJString(daumUrl),is(reJson));

    }
}
