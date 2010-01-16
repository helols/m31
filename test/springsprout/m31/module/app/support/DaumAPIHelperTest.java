/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오후 3:15:05
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

import org.junit.Test;
import springsprout.m31.domain.enums.OpenApi;
import springsprout.m31.module.gateway.support.SpringPlayerCri;
import springsprout.m31.dto.SpringPlayerDTO;
import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.module.gateway.support.DaumAPIHelper;

import java.util.ArrayList;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

public class DaumAPIHelperTest {
    
    @Test
    public void testSpringsee() throws Exception {
        ArrayList<SpringseeDTO> r_list = new ArrayList<SpringseeDTO> ();
        String[] apiInfo = new String[]{"http://apis.daum.net/search/image?apikey=d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c&q=","JSON"};
        DaumAPIHelper.springsee(r_list,apiInfo,"daum",1,20);

        assertThat(r_list.get(0).getThumbnail(),is("http://image02.search.daum-img.net/03/0.c3.b6.BL_shopping-how_472_0.jpg"));
        assertThat(r_list.get(9).getWidth(),is("600"));

    }

    @Test
    public void testGetMovie() throws Exception {
        SpringPlayerCri cri = new SpringPlayerCri();
        cri.setLimit(20);
        cri.setQ("test");
        cri.setStart(0);
        cri.setType(OpenApi.DAUM);

        SpringPlayerDTO dto = DaumAPIHelper.getMovie(cri);
        System.out.println(dto);

    }
}
