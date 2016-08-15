define(
  'ephox.alloy.api.Component',

  [
    'ephox.alloy.api.NoContextApi',
    'ephox.alloy.construct.ComponentApis',
    'ephox.alloy.construct.ComponentDom',
    'ephox.alloy.construct.ComponentEvents',
    'ephox.alloy.construct.CustomDefinition',
    'ephox.alloy.dom.DomModification',
    'ephox.alloy.dom.DomRender',
    'ephox.alloy.util.ExtraArgs',
    'ephox.boulder.api.ValueSchema',
    'ephox.peanut.Fun',
    'ephox.scullion.Cell'
  ],

  function (NoContextApi, ComponentApis, ComponentDom, ComponentEvents, CustomDefinition, DomModification, DomRender, ExtraArgs, ValueSchema, Fun, Cell) {
    var build = function (spec) {
      var systemApi = Cell(NoContextApi());

      var info = ValueSchema.getOrDie(CustomDefinition.toInfo(spec));
      var behaviours = CustomDefinition.behaviours(info);

      var definition = CustomDefinition.toDefinition(info);

      var modification = ComponentDom.combine(info, behaviours, definition).getOrDie();
      console.log('modification', DomModification.modToRaw(modification));
      var modDefinition = DomModification.merge(definition, modification);

      var item = DomRender.renderToDom(modDefinition);

      var baseEvents = {
        'alloy.base.behaviour': CustomDefinition.toEvents(info)
      };

      var events = ComponentEvents.combine(info, behaviours, baseEvents).getOrDie();
      
      // Curry a lazy argument into the API. Invoke it before calling.
      var apis = ComponentApis.combine(info, behaviours, [
        ExtraArgs.lazy(function () { return self; })
      ]).getOrDie();
      
      var connect = function (newApi) {
        systemApi.set(newApi);
      };

      var debugSystem = function () {
        return systemApi.get().debugLabel();
      };

      var self = {
        getSystem: systemApi.get,
        debugSystem: debugSystem,
        connect: connect,
        label: Fun.constant(info.label()),
        element: Fun.constant(item),
        // Note: this is only the original components.
        components: Fun.constant(info.components()),
        item: Fun.constant(item),
        events: Fun.constant(events),
        apis: Fun.constant(apis)
      };

      return self;
    };

    return {
      build: build
    };
  }
);