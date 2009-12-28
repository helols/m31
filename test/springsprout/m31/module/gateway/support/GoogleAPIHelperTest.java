package springsprout.m31.module.gateway.support;

import org.junit.Test;
import springsprout.m31.common.OpenApi;
import springsprout.m31.dto.SpringPlayerCri;
import springsprout.m31.dto.SpringPlayerDTO;

public class GoogleAPIHelperTest {
    @Test
    public void testGetMovie() throws Exception {
        SpringPlayerCri cri = new SpringPlayerCri();
        cri.setLimit(20);
        cri.setStart(0);
        cri.setQ("test");
        cri.setType(OpenApi.GOOGLE);
        SpringPlayerDTO dto = GoogleAPIHelper.getMovie(cri);
        
        System.out.println(dto);
    }
}
