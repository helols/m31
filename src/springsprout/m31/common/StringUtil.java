package springsprout.m31.common;

/**
 * Created by IntelliJ IDEA.
 * User: Miracle
 * Date: 2010. 1. 22
 * Time: 오전 12:46:57
 * To change this template use File | Settings | File Templates.
 */
public class StringUtil {
    /**
     * 쌍 따옴표를 그냥 따옴표로 변경시켜 줍니다.
     * @param source 소스
     * @return 변경된 문자열
     */
    public static String doubleQuotationEscape(String source) {

        if(source == null) {
            return null;
        }

        return org.springframework.util.StringUtils.replace(source, "\"", "'");
    }
}
