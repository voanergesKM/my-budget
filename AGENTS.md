# Project conventions

## Forms

- Build application forms with the existing TanStack Form composition in `app/ui/components/Form/index.tsx`. Use `useAppForm` and compose fields through `form.AppField` and registered `field.*` components; use `form.AppForm` and its form components where appropriate.
- Before adding a form control, check `app/ui/components/Form/fields` for an existing field. Prefer the project's fields (such as `TextField`, `AmountField`, `DateField`, `TextAreaField`, and category selectors) over standalone HTML or shadcn inputs for form data.
- If a form needs capabilities missing from an existing field, extend that field in a reusable, backward-compatible way. For a genuinely new field, follow the existing `useFieldContext` pattern and register it with `createFormHook` when it is generally useful. Use `withFieldGroup` for reusable groups when it fits.
- Keep form values, validation, errors, and submission in the form's existing TanStack Form flow. Reuse the project's schemas and conventions, and preserve labels, accessibility, localization, disabled states, and responsive styling.
- Use standalone controls for interactions that are not ordinary form fields, such as a file-upload trigger, search, or a one-off action, when the existing form fields do not fit. Do not force unrelated UI state into a form.

## Commit review

- Before creating a commit through Codex, delegate an independent review of the exact staged changes to the `change_reviewer` agent. Include surrounding code as needed to assess correctness, regressions, data integrity, security, and test coverage.
- Address actionable findings within the authorized scope and review any resulting staged changes before committing. Report unresolved findings and checks that could not be performed. Respect the user's intended staging and commit scope.
