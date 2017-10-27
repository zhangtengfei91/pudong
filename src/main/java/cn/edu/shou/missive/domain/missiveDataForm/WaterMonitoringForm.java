package cn.edu.shou.missive.domain.missiveDataForm;

import cn.edu.shou.missive.domain.BaseEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
/**
 * Created by DELL on 2017/8/15.
 */
public class WaterMonitoringForm extends BaseEntity{
    @Setter @Getter
    public String type;
    @Setter @Getter
    public String introduction;
    @Setter @Getter
    public String imgurl;
    @Setter @Getter
    public String dataurl;
    @JsonManagedReference
    public String getType(){
        return type;
    }
    public void setType(String type){
        this.type=type;
    }
    public String getIntroduction(){
        return introduction;
    }
    public void setIntroduction(String introduction){
        this.introduction=introduction;
    }

    public String getImgurl() {
        return imgurl;
    }

    public void setImgurl(String imgurl) {
        this.imgurl = imgurl;
    }

    public String getDataurl() {
        return dataurl;
    }

    public void setDataurl(String dataurl) {
        this.dataurl = dataurl;
    }
}
