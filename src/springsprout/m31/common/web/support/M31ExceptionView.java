/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 17
 * Time: 오전 11:11:58
 * enjoy springsprout ! development!
 */
package springsprout.m31.common.web.support;

import org.springframework.web.servlet.view.AbstractView;
import org.springframework.web.servlet.view.json.MappingJacksonJsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class M31ExceptionView  extends AbstractView{

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setStatus(500);
        response.setContentType(MappingJacksonJsonView.DEFAULT_CONTENT_TYPE);
        response.getWriter().print("{success:'fail',message:'error'}");
    }
}
