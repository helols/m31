/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 18
 * Time: 오전 1:52:02
 * enjoy springsprout ! development!
 */
package springsprout.m31.common;

import springsprout.m31.common.web.support.ModelAndJsonViewResolver;

public class M31System {
    public static final String ENCODING = "UTF-8";
	public static final String AVATAR_URL = "http://www.gravatar.com/avatar/";
    public static final String GUEST_MAIL = "s2cmailer@gmail.com";
	public static final String DEFAULT_STORE_BASE = "/springsprout/upload";
	public static final String JSON_VIEW  = ModelAndJsonViewResolver.DEFAULT_JSONVIEW_NAME;
	public static final String CLEAN_KEY  = ModelAndJsonViewResolver.DEFAULT_CLEAR_KEY;
    public static final String DUMMY_VIEW = "dummyView"; 
}
