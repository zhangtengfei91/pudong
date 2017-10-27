package cn.edu.shou.missive.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;


import javax.persistence.*;


/**
 * Created by sqhe on 14-7-12.
 */
@Entity
@Table(name = "DisasterWarning")

public class DisasterWarning extends BaseEntity{
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
