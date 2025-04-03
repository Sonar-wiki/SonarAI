# SONAR Logo Installation Instructions

The SVG logo provided is too large to be directly added through the code editing interface. Please follow these steps to manually add the logo to your project:

1. Create a file named `logo.svg` in the `public` directory
2. Copy the entire SVG content from the original source and paste it into this file
3. The SVG code begins with:
   ```svg
   <svg id="TC" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
   ```
   And includes many path elements and style definitions

4. Save the file

5. The logo will then be accessible in your application via:
   ```jsx
   <img src="/logo.svg" alt="SONAR Logo" width="200" height="200" />
   ```

## Alternative Approach

If you prefer to avoid using the large SVG file directly, consider:

1. Converting the SVG to a simpler version using an SVG optimizer
2. Using a PNG or WebP version of the logo instead
3. Creating a simplified logo using CSS and HTML

## Reference in README

The README.md has been updated to include a placeholder for the logo with instructions on how to add it properly. 