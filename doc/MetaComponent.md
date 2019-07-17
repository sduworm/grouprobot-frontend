# 元数据引擎 使用说明
## 初始化
initMetadata方法进行初始化

`import { initMetadata } from 'meta-component';`
```
const config = {
     request,//（function）请求方法，可空，不传走默认，一般情况下必须自定义。外层框架和内部元数据引擎建议使用同一request方法，以便于共用token，公共错误处理等能力。
     metaBaseUrl, //（string）UI元数据请求url基地址，可空，不传走默认，一般情况下必须自定义。元数据能力可应用于多业务系统，不同的业务系统使用元数据时，暴露的元数据请求基地址是不同的。
     serviceBaseUrl,//（string）业务服务url基地址，可空，不传默认为/。一般用于自定义组件时调用的自定义接口请求url，以及UI元数据描述的自定义接口请求url：在这几类请求前的前缀。
     engineConf,//（object）解析引擎配置。TODO
     customComponents,//（object）自定义组件。参见下方自定义组件章节说明。
     customObserver,//（object）自定义元数据观察者。参见下方自定义组件章节说明。
     // TODO 日志开关配置
   };
initMetadata(config);
```
## 元数据组件
`import MetaComponent from 'meta-component';`

用于元数据界面渲染

参数说明：
- search[String] 例:'type=form&cmpId=5bcae0e14f50ea43e4c6115g&metaOpStatus=edit'
  - type 必填 可选值:form、composite-view、composite-form
  - cmpId 必填 UI元数据的编码
  - metaOpStatus 必填 可选值：create、edit、view 由业务场景决定
- params[Object] 例:{metaId: 'basic-info'}
  - metaId 必填 用于此业务界面唯一标识
- history[Object] 可以使用React-Router方式下传入组件的当前history；或其他实现了goBack与push方法的history对象，以适配不使用路由的外层框架。
- 其他，选填，待补充

### 常规引用：
MetaComponent是一个React组件。像其他所有常规React组件一样，MetaComponent支持在其他的React组件的render方法中使用它，用于以元数据的方式渲染界面中的某个部分。同时，也可以使用React-Router路由直接将路由地址指向该MetaComponent组件，以路由和组件映射的方式用元数据绘制界面。上述这些方式和其他常规的React组件的用法并无区别。

### 路由(React-Router)引用：
MetaComponent组件的参数格式之所以这样设计，是为了便于与外层框架的React-Router(version>=4)结合。这些参数通过React-Router可以很方便的带入。

#### 路由配置建议：
```
      {
        name: 'meta',
        component: MetaComponent,
        path: '/*/meta-page/:metaId',
      }
      // umi框架的路由配置样例
```
#### 路由地址样例：
http://localhost:8000/#/paas/meta-page/student?type=composite-view&cmpId=5bcaf29f4f50ea29fc8772d0&metaOpStatus=search

此时，

search参数的值为'type=composite-view&cmpId=5bcaf29f4f50ea29fc8772d0&metaOpStatus=search'

params参数的值为{metaId: 'student'}

history是由React-Router框架默认传入的，开发者无需关心

即可以通过在浏览器访问以上地址，就可实现直接用元数据渲染路由对应的界面指定区域。

## 元数据基础组件
`import { MetaBaseComponents } from 'meta-component';`

可用于自定义组件时引用的元数据基础组件

组件列表：参见下方自定义组件章节说明。

## 元数据内置增强型组件
`import { MetaAdditionalComponents } from 'meta-component';`

元数据提供的一些React组件，可供二次开发使用

组件列表：参见下方自定义组件章节说明。

## Custom Component
自定义组件
### 概念
业务功能存在个性化，常规的元数据基础功能无法做到完全地适配业务功能。

元数据能力支持对一组业务功能进行自定义扩展开发。针对一组业务进行的自定义开发可以理解为一个**业务包**。

业务包和业务功能有关，和租户差异无关。

业务包包含一组自定义渲染组件，有可能还会包含一个**观察者**。

#### 观察者：一个可以对ui元数据进行加工的方法。
观察者会被注册到元数据引擎中，当观察到从后端获取了ui元数据时，就会进行观察者指定的处理。

在元数据描述中，可以指定使用自定义组件。可以在元数据描述配置中指定，也可以使用观察者实现该功能。

自定义组件指定的字段是`cmp.cmpAttr.customComponent`

开发一个观察者，对ui元数据进行处理，在解析到某个具体的组件描述时，更改它的渲染组件为自定义组件。

#### 元数据组件库
##### 基础组件
元数据引擎库提供基础组件供自定义组件开发时使用
```
import { MetaABaseComponents } from 'meta-component';
const { Button } = MetaABaseComponents;
```

##### 内置增强型组件
TODO

#### 注册自定义组件
```
initMetadata({
               ...config,
               customComponents,
               customObserver,
             });
```
以配置项形式注册业务包的内容。

customComponents对象中包含所有的自定义组件，**每个自定义组件key须以```custom/```开头**。

customObserver即观察者实现方法。

#### 基础组件
- 基础组件是元数据引擎提供的。
- 基础组件对外暴露，供自定义开发的组件引用。
- 基础组件一般都会对应默认的ui元数据渲染。比如文本类型的section_field默认会用Text基础组件进行渲染。
- 基础组件包括多种级别，有field级、module级。同级别之间的基础组件才支持自定义互相替换，否则不识别。所有级别的基础组件都会对外暴露，供使用，但外界无需关心级别。

基础组件（级别）列表：TODO


#### 替换默认基础组件
前端界面会根据ui元数据描述用默认基础组件进行渲染，除非：
- 请求到的ui元数据描述中指定了使用customComponent。
- 通过观察者将ui元数据进行加工了，从而对默认行为进行了加强或变更。

customComponent配置原则：
- 只支持同级别基础组件。
- 或配置为任意custom级别的组件。
