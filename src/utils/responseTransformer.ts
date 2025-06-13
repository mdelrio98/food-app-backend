import { Types } from 'mongoose';

// Helper to convert _id to id and handle Mongoose Document to plain object
const toPlainObject = (doc: any): any => {
  if (doc && typeof doc.toObject === 'function') {
    // Using getters: true ensures virtuals are included if you have any
    // transform is a powerful Mongoose feature for customizing the toObject output
    return doc.toObject({
      getters: true,
      virtuals: true, // Include virtuals if any
      transform: (originalDoc: any, ret: any) => {
        if (ret._id !== undefined && ret._id !== null) {
          ret.id = ret._id.toString(); // Ensure id is a string
        } else if (ret.id === undefined) {
          // If _id is null/undefined and id isn't already set, ensure id is not present or is null
          // Depending on desired behavior, you might want to explicitly set ret.id = null or delete it
        }
        delete ret._id;
        delete ret.__v; // Remove version key
        delete ret.createdAt;
        delete ret.updatedAt;
        // You can add more transformations here if needed
        // e.g., delete ret.password;
        return ret;
      },
    });
  }
  // If it's not a Mongoose document but a plain object that might have _id
  if (doc && typeof doc === 'object' && doc._id) {
    const plainDoc = { ...doc }; // Create a shallow copy
    if (plainDoc._id !== undefined && plainDoc._id !== null) {
      plainDoc.id = plainDoc._id.toString();
    } else if (plainDoc.id === undefined) {
      // Consistent handling if _id is null/undefined
    }
    delete plainDoc._id;
    if (plainDoc.__v !== undefined) {
        delete plainDoc.__v;
    }
    if (plainDoc.createdAt !== undefined) {
        delete plainDoc.createdAt;
    }
    if (plainDoc.updatedAt !== undefined) {
        delete plainDoc.updatedAt;
    }
    return plainDoc;
  }
  return doc; // Return as is if not a Mongoose doc or plain object with _id
};

export const transformResponse = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => transformResponse(item));
  }

  if (data && typeof data === 'object') {
    let transformedData = toPlainObject(data);

    // Recursively transform nested properties if it's still an object
    if (transformedData && typeof transformedData === 'object') {
      const result: { [key: string]: any } = {};
      for (const key in transformedData) {
        if (Object.prototype.hasOwnProperty.call(transformedData, key)) {
          result[key] = transformResponse(transformedData[key]);
        }
      }
      return result;
    }
    return transformedData;
  }
  return data;
};
