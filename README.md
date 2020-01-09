# Script to auto relative path hell refactoring
Auto refactoring script to make from relative path imports to *absolute paths based on module*.

Imports like this
```
import { SERVICES } from "../../../../src/mmb/consts/additionalServices"
```

will be refactored based on specified modules
```
import { SERVICES } from "mmb/consts/additionalServices"
```

Only fo backup purposes. Maybe it will be handy sometime.
