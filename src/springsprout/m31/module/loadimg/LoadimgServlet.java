/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 25
 * Time: 오후 8:04:24
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.loadimg;

import springsprout.m31.common.OpenApiReadException;
import springsprout.m31.utils.M31Utils;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.IOException;

import static springsprout.m31.utils.OpenApiRequestHelper.loadApi;

public class LoadimgServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("image/*");
        byte[] buffer = new byte[2048];
        ServletOutputStream out = res.getOutputStream();
        BufferedInputStream in = null;
        try {
        	in = new BufferedInputStream(loadApi(M31Utils.urlDecode(req.getParameter("imgsrc"))));
            int n = 0;
            int t = -1;
            while ((n = in.read(buffer, 0, 2048)) != -1) {
                t++;
                out.write(buffer, 0, n);
            }//while
            if(t < 0){
                new OpenApiReadException("no image file...");
            }
        } catch (Exception e) {
            out.println("ImgLoad Exception!!! : " + e);
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (Exception e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (Exception e) {
                }
            }
        }
    }
}