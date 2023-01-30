/**Turn object into form data */
function objectToFormData(obj) {
  const formData = new FormData();
  for (const key of Object.keys(obj)) {
    formData.append(key, obj[key]);
  }
  return formData;
}

export { objectToFormData };
