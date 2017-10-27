package cn.edu.shou.missive.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
/**
 * Created by DELL on 2017/8/15.
 */
@Entity
public class WaterMonitoring extends BaseEntity{
    @JsonManagedReference
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
