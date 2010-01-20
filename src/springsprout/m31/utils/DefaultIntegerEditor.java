package springsprout.m31.utils;

import java.beans.PropertyEditorSupport;

import org.apache.commons.lang.ObjectUtils;
import org.springframework.util.NumberUtils;
import org.springframework.util.StringUtils;

public class DefaultIntegerEditor extends PropertyEditorSupport {
    
	@Override
    public void setAsText(String text) throws IllegalArgumentException {
    	if(StringUtils.hasText(text)){
    		setValue(NumberUtils.parseNumber(text, Integer.class).intValue());
    	}
    	else{
    		setValue(0);
    	}
    }		
    
    @Override
    public String getAsText() {
        return ObjectUtils.toString(getValue());
    }
    
}