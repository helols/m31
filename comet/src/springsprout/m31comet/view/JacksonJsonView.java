/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 25
 * Time: 오후 5:47:22
 * enjoy springsprout ! development!
 */
package springsprout.m31comet.view;

import org.codehaus.jackson.JsonEncoding;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializerFactory;
import org.springframework.util.Assert;
import org.springframework.web.servlet.View;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Set;

/**
 * Spring-MVC {@link View} that renders JSON content by serializing the model for the current request using <a
 * href="http://jackson.codehaus.org/">Jackson's</a> {@link ObjectMapper}.
 * <p/>
 * <p>By default, the entire contents of the model map (with the exception of framework-specific classes) will be
 * encoded as JSON. For cases where the contents of the map need to be filtered, users may specify a specific set of
 * model attributes to encode via the {@link #setRenderedAttributes(Set) renderedAttributes} property.
 *
 * @author Jeremy Grelle
 * @author Arjen Poutsma
 * @see org.springframework.http.converter.json.MappingJacksonHttpMessageConverter
 * @since 3.0
 */
public class JacksonJsonView {

    /**
     * Default content type. Overridable as bean property.
     */
    public static final String DEFAULT_CONTENT_TYPE = "application/json";

    private ObjectMapper objectMapper = new ObjectMapper();

    private JsonEncoding encoding = JsonEncoding.UTF8;

    private boolean prefixJson = false;

    /**
     * Construct a new {@code JacksonJsonView}, setting the content type to {@code application/json}.
     */
    public JacksonJsonView() {
    }

    /**
     * Sets the {@code ObjectMapper} for this view. If not set, a default {@link ObjectMapper#ObjectMapper() ObjectMapper}
     * is used.
     * <p/>
     * <p>Setting a custom-configured {@code ObjectMapper} is one way to take further control of the JSON serialization
     * process. For example, an extended {@link SerializerFactory} can be configured that provides custom serializers for
     * specific types. The other option for refining the serialization process is to use Jackson's provided annotations on
     * the types to be serialized, in which case a custom-configured ObjectMapper is unnecessary.
     */
    public void setObjectMapper(ObjectMapper objectMapper) {
        Assert.notNull(objectMapper, "'objectMapper' must not be null");
        this.objectMapper = objectMapper;
    }

    /**
     * Sets the {@code JsonEncoding} for this converter. By default, {@linkplain JsonEncoding#UTF8 UTF-8} is used.
     */
    public void setEncoding(JsonEncoding encoding) {
        Assert.notNull(encoding, "'encoding' must not be null");
        this.encoding = encoding;
    }

    /**
     * Indicates whether the JSON output by this view should be prefixed with "{@code {} &&}". Default is false.
     * <p/>
     * <p> Prefixing the JSON string in this manner is used to help prevent JSON Hijacking. The prefix renders the string
     * syntactically invalid as a script so that it cannot be hijacked. This prefix does not affect the evaluation of JSON,
     * but if JSON validation is performed on the string, the prefix would need to be ignored.
     */
    public void setPrefixJson(boolean prefixJson) {
        this.prefixJson = prefixJson;
    }

    public void render(Map<String, Object> model,
                          HttpServletRequest request,
                          HttpServletResponse response){

        response.setContentType(DEFAULT_CONTENT_TYPE);
        response.setCharacterEncoding(encoding.getJavaName());

        try {
            JsonGenerator generator = objectMapper.getJsonFactory().createJsonGenerator(response.getOutputStream(), encoding);
            if (prefixJson) {
                generator.writeRaw("{} && ");
            }
            objectMapper.writeValue(generator, model);
            response.flushBuffer();
        } catch (Exception e) {
            throw new RuntimeException("error render");
        }
    }
}

