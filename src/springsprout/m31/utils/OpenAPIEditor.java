package springsprout.m31.utils;

import springsprout.m31.domain.enums.OpenApi;

import java.beans.PropertyEditorSupport;

import static springsprout.m31.utils.M31Utils.convert;

public class OpenAPIEditor extends PropertyEditorSupport {
    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        OpenApi openApiType = convert(text.toUpperCase());
        setValue(openApiType);        
    }
}
