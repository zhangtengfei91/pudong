import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.boot.context.embedded.MultipartConfigFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.MultipartConfigElement;

//import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;


@Configuration
@EnableJpaRepositories
//@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
@EntityScan
@ComponentScan({"cn.edu.shou.missive"})
//@Import(RepositoryRestMvcConfiguration.class)
//@ImportResource({"activiti-standalone-context.xml"})
//@Import(ThymeleafEmailConfiguration.class)
//@Import(ScheduledTasks.class)//定时程序，先关闭
@EnableAutoConfiguration
@EnableConfigurationProperties
public class OAApp {



    @Bean(name = DispatcherServletAutoConfiguration.DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
    public DispatcherServlet dispatcherServlet()
    {
        return new DispatcherServlet();
    }


    @Bean
    MultipartConfigElement multipartConfigElement(){
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize("256MB");
        factory.setMaxRequestSize("256MB");
        return factory.createMultipartConfig();
    }

//    @Bean
//    public ServletRegistrationBean dispatcherServletRegistration() {
//        ServletRegistrationBean registration = new ServletRegistrationBean(dispatcherServlet());
//        registration.addUrlMappings("/");
//        registration.setOrder(1);
//        return registration;
//    }
//
//
//    @Bean
//    public ServletRegistrationBean activitiExplorerRestServletRegistration() {
//        ServerServlet serverServlet = new ServerServlet();
//        ServletRegistrationBean registration = new ServletRegistrationBean(serverServlet);
//        Map<String,String> params = new HashMap<String,String>();
//        params.put("org.restlet.application","cn.edu.shou.missive.web.ExplorerRestApplication");
//        registration.setInitParameters(params);
//        registration.addUrlMappings("/diagram-viewer/service/*");
//        return registration;
//    }


    /**
     * Configure the CharacterEncodingFilter to filt all request with encode utf-8
     * */
    @Bean
    public FilterRegistrationBean filterRegistrationBean () {
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("utf-8");
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setFilter(characterEncodingFilter);
        registrationBean.setOrder(0);
        return registrationBean;
    }



    public static void main(String[] args) throws Exception {
        SpringApplication.run(OAApp.class, args);
    }

}