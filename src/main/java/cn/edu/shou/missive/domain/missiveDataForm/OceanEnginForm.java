package cn.edu.shou.missive.domain.missiveDataForm;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by DELL on 2017/8/15.
 */
public class OceanEnginForm extends BaseEntityForm{
    @Getter
    @Setter
    public String type;
    @Getter @Setter
    public String title;
    @Getter @Setter
    public String area;
    @Getter @Setter
    public String introduction;
    @Getter @Setter
    public String imgurl;
    @Getter @Setter
    public String dataurl;
    @Getter @Setter
    public String date;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
