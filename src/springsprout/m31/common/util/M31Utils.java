/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 11:24:55
 * enjoy springsprout ! development!
 */
package springsprout.m31.common.util;

import springsprout.m31.common.OpenApi;
import springsprout.m31.common.OpenApiReadException;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import static springsprout.m31.common.M31System.ENCODING;

public class M31Utils {
    public static String urlDecode(String query) {
        try {
            query = URLDecoder.decode(query, ENCODING);
        } catch (UnsupportedEncodingException e) {
            throw new OpenApiReadException(e);
        }
        return query;
    }

    public static OpenApi convert(String source) {
        if (source.length() == 0) {
            return null;
        }
        return Enum.valueOf(OpenApi.class, source.trim());
    }
}
