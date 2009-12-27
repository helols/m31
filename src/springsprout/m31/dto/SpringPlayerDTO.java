package springsprout.m31.dto;

import springsprout.m31.domain.MovieVO;

import java.util.List;

/**
 * @author miracle
 */
public class SpringPlayerDTO {
    private int total;
    private boolean success;

    private List<MovieVO> list;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<MovieVO> getList() {
        return list;
    }

    public void setList(List<MovieVO> list) {
        this.list = list;
    }

    @Override
    public String toString() {
        return "SpringPlayerDTO{" +
                "total=" + total +
                ", success=" + success +
                ", list=" + list +
                '}';
    }
}
