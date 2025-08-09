# Alert System Documentation

This documentation explains how to use the reusable alert system in your components.

## Overview

The alert system consists of:
- `AlertProvider` - Context provider that manages alert state
- `useAlert()` - Hook to access alert context
- `useAlertActions()` - Convenient hook with pre-defined alert functions

## Setup

The `AlertProvider` is already set up in the dashboard layout, so any component within the dashboard can use alerts.

## Usage in Components

### Method 1: Using useAlertActions (Recommended)

```typescript
import { useAlertActions } from "@/lib/use-alert";

export default function MyComponent() {
    const { showError, showSuccess, showWarning, showInfo } = useAlertActions();

    const handleSubmit = async () => {
        try {
            // Your logic here
            const response = await fetch('/api/some-endpoint');
            
            if (response.ok) {
                showSuccess("Operation completed successfully!");
            } else {
                showError("Something went wrong!");
            }
        } catch (error) {
            showError("Network error occurred");
        }
    };

    return (
        // Your component JSX
    );
}
```

### Method 2: Using useAlert directly

```typescript
import { useAlert } from "@/lib/alert-context";

export default function MyComponent() {
    const { showAlert } = useAlert();

    const handleAction = () => {
        showAlert("Custom message", "warning");
    };

    return (
        // Your component JSX
    );
}
```

## Available Alert Types

### 1. Error Alerts
```typescript
showError("This is an error message");
// or
showAlert("This is an error message", "destructive");
```

### 2. Success Alerts
```typescript
showSuccess("Operation completed successfully!");
// or
showAlert("Operation completed successfully!", "success");
```

### 3. Warning Alerts
```typescript
showWarning("Please check your input");
// or
showAlert("Please check your input", "warning");
```

### 4. Info Alerts
```typescript
showInfo("Here's some information");
// or
showAlert("Here's some information", "default");
```

## Alert Features

- **Auto-dismiss**: All alerts automatically disappear after 3 seconds
- **Fixed positioning**: Alerts appear at the top center of the screen
- **Responsive design**: Alerts adapt to different screen sizes
- **Custom styling**: Each alert type has its own color scheme and icon
- **Z-index management**: Alerts appear above all other content

## Alert Variants

| Variant | Description | Color Scheme | Icon |
|---------|-------------|--------------|------|
| `destructive` | Error messages | Red | AlertCircle |
| `success` | Success messages | Green | CheckCircle |
| `warning` | Warning messages | Yellow | AlertTriangle |
| `default` | Info messages | Blue | Info |

## Examples

### Form Validation
```typescript
const { showError, showSuccess } = useAlertActions();

const validateForm = () => {
    if (!email) {
        showError("Email is required");
        return false;
    }
    if (!password) {
        showError("Password is required");
        return false;
    }
    return true;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
        await submitForm();
        showSuccess("Form submitted successfully!");
    } catch (error) {
        showError("Failed to submit form");
    }
};
```

### API Operations
```typescript
const { showError, showSuccess, showWarning } = useAlertActions();

const deleteItem = async (id: string) => {
    try {
        const response = await fetch(\`/api/items/\${id}\`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess("Item deleted successfully!");
        } else if (response.status === 404) {
            showWarning("Item not found");
        } else {
            showError("Failed to delete item");
        }
    } catch (error) {
        showError("Network error occurred");
    }
};
```

### User Feedback
```typescript
const { showInfo, showSuccess } = useAlertActions();

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
};

const showHelpInfo = () => {
    showInfo("Click the button to copy the GST number");
};
```

## Best Practices

1. **Use appropriate variants**: Choose the right alert type for your message
2. **Keep messages concise**: Short, clear messages work best
3. **Don't overuse**: Avoid showing multiple alerts in quick succession
4. **Provide context**: Include relevant information in error messages
5. **Test auto-dismiss**: Ensure 3 seconds is enough time to read the message

## Implementation Details

- Alerts are managed by React Context
- State is automatically cleaned up when alerts hide
- The system prevents multiple alerts from stacking
- Custom CSS classes provide consistent styling across variants
