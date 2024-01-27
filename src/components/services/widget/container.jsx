import { useContext } from "react";

import Error from "./error";

import { SettingsContext } from "utils/contexts/settings";

export default function Container({ error = false, children, service }) {
  const { settings } = useContext(SettingsContext);

  if (error) {
    if (settings.hideErrors || service.widget.hide_errors) {
      return null;
    }

    return <Error service={service} error={error} />;
  }

  const childrenArray = Array.isArray(children) ? children : [children];

  let visibleChildren = childrenArray;
  let fields = service?.widget?.fields;
  if (typeof fields === "string") fields = JSON.parse(service.widget.fields);
  const type = service?.widget?.type;
  if (fields && type) {
    // if the field contains a "." then it most likely contains a common loc value
    // logic now allows a fields array that can look like:
    // fields: [ "resources.cpu", "resources.mem", "field"]
    // or even
    // fields: [ "resources.cpu", "widget_type.field" ]

    // Return the children in the order the fields were provided
    visibleChildren = [];
    fields.forEach((field) => {
      let fullField = field;
      if (!field.includes(".")) {
        fullField = `${type}.${field}`;
      }
      visibleChildren.push(childrenArray.find((child) => fullField === child?.props?.label));
    });
  }

  return <div className="relative flex flex-row w-full service-container">{visibleChildren}</div>;
}
