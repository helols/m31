/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오후 3:15:05
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class DaumAPIHelperTest {
    
    @Test
    public void testSpringsee() throws Exception {
        ArrayList<HashMap<String,String>> r_list = new ArrayList<HashMap<String,String>> ();
        String[] apiInfo = new String[]{"http://apis.daum.net/search/image?apikey=d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c&q=","JSON"};
        DaumAPIHelper.springsee(r_list,apiInfo,"daum",0);

        assertThat(r_list.get(0).get("thumbnail"),is("http://image02.search.daum-img.net/03/0.c3.b6.BL_shopping-how_472_0.jpg"));
        assertThat(r_list.get(9).get("pubDate"),is("20081224212859"));

    }
}
