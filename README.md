# Kalendar

Easy to use, non-bloated calendar utilising the Date API.

## Guide

#### Running

`npm run dev`

#### Props

| Prop     | Description                                        | Options                | Default                                                                                             |
| -------- | -------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| value    | Selected date                                      | `function`             |                                                                                                     |
| onChange | On change callback setting the selected date state | `setState`             |                                                                                                     |
| date     | Currently displayed month                          | `Date`                 | Today's date                                                                                        |
| size     | Calendar size                                      | `"default" \| "small"` | `"default"`                                                                                         |
| locale   | Preferred locale, language                         | `Intl.LocalesArgument` | User's preferred language, usually the language of the browser UI. If not found, defaults to `"en"` |
