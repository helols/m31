/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 2:28:59
 * enjoy springsprout ! development!
 */
package springsprout.m31.common;

public class OpenApiReadException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public OpenApiReadException() {
        super();
    }

    public OpenApiReadException(Throwable e) {
        super(e);
    }

    public OpenApiReadException(String msg, Throwable e) {
        super(msg, e);
    }

    public OpenApiReadException(String msg) {
        super(msg);
    }
}
