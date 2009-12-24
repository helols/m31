/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 2:17:28
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.jdom.Document;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertThat;
import static springsprout.m31.utils.OpenApiRequestHelper.*;

public class OpenApiRequestHelperTest {

    @Test
    public void testLoadApi() throws Exception {
        String naverUrl = "http://openapi.naver.com/search?key=b020ac68a52b2089aae394e4ec7bff2d&target=rank&query=nexearch";
        String daumUrl = "http://apis.daum.net/search/image?q=dog&apikey=d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c&output=json";

        assertThat(loadApi(naverUrl), is(notNullValue()));
        String reJson = "{\"channel\":{\"item\":[{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/b/ca/70/BL_0ArtX_14717490_10.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717490\",\"pubDate\":\"20080123225718\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/e/5f/02/BL_0ArtX_14717583_8.jpg\",\"width\":\"800\",\"height\":\"600\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717583\",\"pubDate\":\"20080123230559\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/9/1e/82/BL_0ArtX_14718500_0.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14718500\",\"pubDate\":\"20080124004123\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/e/6e/91/BL_0ArtX_14718500_14.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14718500\",\"pubDate\":\"20080124004123\",\"author\":\"To2\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/4.5a.69.CF_sfVa_2jc9_460_3.jpg\",\"width\":\"720\",\"height\":\"480\",\"cp\":\"15\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://cafe.daum.net/bytal1/2Ts9/601?docid=sfVa|2Ts9|601|20091119115940\",\"pubDate\":\"20091119115940\",\"author\":\"2nSxW\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/1.08.02.TI_388491874_2.gif\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://domi9.tistory.com/90\",\"pubDate\":\"20090319124737\",\"author\":\"domi9@hanmail.net\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/0/4d/f0/BL_0ArtX_14717490_0.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717490\",\"pubDate\":\"20080123225718\",\"author\":\"To2\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/5.6b.1e.TI_19720_169_0.jpg\",\"width\":\"800\",\"height\":\"536\",\"cp\":\"7\",\"title\":\"DOG\",\"image\":\"\",\"link\":\"http://camelo.tistory.com/169\",\"pubDate\":\"20090215214641\",\"author\":\"mean9@nate.com\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img02/4/e4/0f/BL_0ArtX_14717490_18.jpg\",\"width\":\"640\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"dog\",\"image\":\"\",\"link\":\"http://blog.daum.net/csy11111/14717490\",\"pubDate\":\"20080123225718\",\"author\":\"To2\"},{\"thumbnail\":\"http://image01.search.hanmail.net/imgthum/img07/7/71/7f/PR_lovewe73_6094766_0.jpg\",\"width\":\"866\",\"height\":\"593\",\"cp\":\"21\",\"title\":\"Dog\",\"image\":\"\",\"link\":\"http://pudding.paran.com/lovewe73/6094766\",\"pubDate\":\"20080911161914\",\"author\":\"\"}],\"sort\":\"1\",\"title\":\"Search image Daum Open API\",\"result\":\"10\",\"totalCount\":7779,\"pageno\":\"1\",\"q\":\"dog\",\"desc\":\"Daum Open API search result\"}}";
        assertThat(loadString(daumUrl), is(reJson));

    }

    @Test
    public void docElementValueToMap() throws Exception {
        String naverUrl = "http://openapi.naver.com/search?key=b020ac68a52b2089aae394e4ec7bff2d&query=제주도&target=image&start=1&display=10";
        String makeString = "{total=4572, title=Naver Open API - image ::'제주도', start=1, description=Naver Search Result, item=[{title=월호리, thumbnail=http://thumbview02.search.naver.com/thumbnails?q=http://dicimg.naver.com/100/800/90/1618890.jpg, link=http://openapi.naver.com/l?AAAB3IQQrDIBCF4dOMSxmTIuPCRRKSe4iZGgu2VjSQ29cGHh8/r16ZbUwusGhxtxr1oMS3cbksrAtMCGa5Y4S5xwy0AT3EUfhpj1ozjBMMW98efUxBvt3JRfpP6pdC7NKt+aO0IjIoXzn8AF+MprF4AAAA, sizewidth=800, sizeheight=531}, {title=[코리안 지오그래픽]제주도 숨은 명소를 찾아, thumbnail=http://thumbview02.search.naver.com/thumbnails?q=http://imgnews.naver.com/image/020/2008/05/30/200805300094.jpg, link=http://openapi.naver.com/l?AAADWMQQ6CMBRET/O7bMYWSFl0AUTuQfRbalKsFTTc3i+JyWTmzSxm3TP7mKbAaotX36AxJ/XcuOyezgN1oHY4wFIv0JMbyVVqLnzz87pmsh2ZURRTWPjz0sv05qIvj3Rs8isJA3EDuF+pxex/QG0BtJW+5/AF6wcl5YwAAAA=, sizewidth=520, sizeheight=578}, {title=이명박-부시 ‘제주도 만남’, thumbnail=http://thumbview01.search.naver.com/thumbnails?q=http://imgnews.naver.com/image/028/2009/08/02/6000285578_20090803.JPG, link=http://openapi.naver.com/l?AAAB1MSw6CMBA9zXTZjK3UYdEFEDFx5Q0M0RG6KCAWDbd3aPLyvslL28w+xK5ntYand+jMQb1XXjYP5wYqhLLJxkItpgZqgY5qWPjlh5RmsBWYVhBiP/Lvo8fuy4t+TDF38iuKhoQNYrkHyo2QQ5SlKE503zcktPp6u/wBfWB6mJMAAAA=, sizewidth=540, sizeheight=382}, {title=&lt;2010WC&gt;허정무호 빛낼 남아공 기대주는?, thumbnail=http://thumbview01.search.naver.com/thumbnails?q=http://imgnews.naver.com/image/003/2009/12/05/NISI20090111_0000450570_web.jpg, link=http://openapi.naver.com/l?AAAB2MwQ6CMBBEv2Z7JNtCEQ49AJGEixc/gKCuUJNirUXC37swmcxM3mHi5slYN4wkFvswOeZKis9CYTNwbqBCKJtjpFDzqKFoocjEFOhpphg9pBWolm3dONP6TebhRyG5v93B+JcbMeVUiCWXVDvRHJfu2u0QpZQ9sjKN+oT9Srfk5cc/Yn/w7JsAAAA=, sizewidth=399, sizeheight=600}, {title=한라산, thumbnail=http://thumbview01.search.naver.com/thumbnails?q=http://hawkeye.ngcsu.edu/%7ESJYOON2908/picture1.jpg, link=http://openapi.naver.com/l?AAACupLEi1zcxNTE9VK81MsTUzMDMyVCssTS2qtFV1dVZ1NFC1dAYzjFWdgAwnVQs3VQsTtYyi1DTbjJKSAlVjR1UjNyDKSCzPTq1M1ctLTy4u1UtNKQULm5q7BntF+vv7GVkaWABFCjKTS0qLUg31sgrSAfNxSAR7AAAA, sizewidth=720, sizeheight=567}, {title=[섬여행] 제주도, 낭만 넘치는 드라이브 천국, thumbnail=http://thumbview02.search.naver.com/thumbnails?q=http://imgnews.naver.com/image/009/2007/12/09/2007121001_110310011.jpg, link=http://openapi.naver.com/l?AAADWMwQqDMBBEv2ZzDLtJsXrIQaX+RpF2G1OIjWls8e+7CoVh5vEOU7bELsTRs1rD3VVYGVLLynlzcOmhRWj6Ayx0Ah3UA9QnNWV+uKmUBLYFM0hC9DN/33oeP5z17RUPJ7+yiI20QTzLkNnNX5AhRLoSod2B9DP5H6qze4SUAAAA, sizewidth=550, sizeheight=549}, {title=줄리안알프스, thumbnail=http://thumbview02.search.naver.com/thumbnails?q=http://www.fotoya.net/PhotoyaPhoto/2009/05/07/16/55/633773121267628750_2774383.jpg, link=http://openapi.naver.com/l?AAAB2IzQqDMBCEn2ZzlGRXs/GQg0o99w2K0PhTaI0SCb59V2H4Zr5JZwx++Q5TUMfy9lZbNGo7wn56eHTQaKi7exC0MlpwPbhSzXsY/ZxSBGoAe0nOuRjXtJ5D8QtJjud8212iqHUtpasLLDBWUF1qiZjJoEHLFh1X+oXMJTkqPnH6A/sozriiAAAA, sizewidth=500, sizeheight=332}, {title=소인국테마파크(수원성), thumbnail=http://thumbview01.search.naver.com/thumbnails?q=http://dicimg.naver.com/100/800/26/451826.jpg, link=http://openapi.naver.com/l?AAAB3IQQqAIBCF4dOMS1ErsYWLkrpH1GQGlokF3b4heHz8vPImtCFOHtkdFquFVpJdN+bXwuCgE9C6PyroKXowI5iabRlXu5WSoOpAjbQlzCF6fkwPZj6fkS4pBGl+lSbqRhql+Z78B6jf/Yx3AAAA, sizewidth=800, sizeheight=533}, {title=한라산, thumbnail=http://thumbview02.search.naver.com/thumbnails?q=http://images4.iwilab.com/shared/item/1/109/109402_500x.jpg?1228599688, link=http://openapi.naver.com/l?AAACVMSw7CIBQ8zWNJ+JXAgkXbyDUMWiwYmyKl0d5eqMnMZD7JlCN5Exc3e7THyUgiGUXv3efDwGWEnoAeT8NhqGYAZUEJFLJ/mFBKAt4DsxXnxyZw/MSXu+H7utRyCy77qa3Ft0wbif6rIOzaEfLFzzQDt5Qx1WktlfoBKBV7VJQAAAA=, sizewidth=500, sizeheight=335}, {title=(투어팁)특색 있는 제주여행, thumbnail=http://thumbview01.search.naver.com/thumbnails?q=http://imgnews.naver.com/image/018/2009/10/20/1256006103.469063_PS09102000062.JPG, link=http://openapi.naver.com/l?AAAB2MwQrCMBBEv2ZzDJukhuSQQ1us4KngB0jRte0htcZU6d+7BoaZxzBM3lcKcxxGEtt8DxatVuK1UdoDHFuoEXxbwEDD0IDrwFViSvQIU84rmBp0x5rjuND3LZfhQ0nenrF0/MuJyrFrRM+hsPCf9MEiWoVGVtajNdf+gl4hD7nW8tyffkgZNUKfAAAA, sizewidth=512, sizeheight=384}], lastBuildDate=Wed, 23 Dec 2009 23:43:58 +0900, link=http://search.naver.com, display=10}";
        Document doc = loadXml(naverUrl);
        Assert.assertThat(OpenApiRequestHelper.docElementValueToMap(doc).toString().substring(0,100),is(makeString.substring(0,100)));
    }

    @Test
    public void docAttributeValueToMap() throws Exception {

        String googleUrl = "http://www.google.co.kr/ig/api?weather=";
        Document doc = loadXml(googleUrl+"seoul");
        Assert.assertThat(
                ((ArrayList < HashMap <String, String>>)OpenApiRequestHelper.docAttributeValueToMap(doc).get("forecast_information"))
                .get(0).get("city"),is("seoul"));
        doc = loadXml(googleUrl+"busan");
        Assert.assertThat(
                ((ArrayList < HashMap <String, String>>)OpenApiRequestHelper.docAttributeValueToMap(doc).get("forecast_information"))
                .get(0).get("city"),is("busan"));
    }

}
