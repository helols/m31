/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오후 2:30:15
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.sandbox;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import springsprout.m31.common.OpenApi;

import static org.hamcrest.core.Is.is;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/testContext.xml")
public class ConversionServiceTest {

    @Autowired
    ConversionService conversionService;
    @Test
    public void conversionTest(){
        Assert.assertThat(conversionService.convert("DAUM", OpenApi.class), is(OpenApi.DAUM));        
        Assert.assertThat(conversionService.convert("NAVER", OpenApi.class), is(OpenApi.NAVER));
        Assert.assertThat(conversionService.convert("GOOGLE", OpenApi.class), is(OpenApi.GOOGLE));
    }
}
