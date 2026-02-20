import mongoose from "mongoose";

const getBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "resume",
  });

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.on("error", (error) => {
      console.error(error);
      return res.status(500).json({ message: "Resume upload failed." });
    });

    uploadStream.on("finish", (file) => {
      return res.status(201).json({
        fileId: file._id,
        filename: file.filename,
        url: `/api/v1/resume/${file._id}`,
      });
    });

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const downloadResumeById = async (req, res) => {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      return res.status(404).json({ message: "Resume not found." });
    }

    const file = files[0];
    res.setHeader("Content-Type", file.contentType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );

    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.on("error", (error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to download resume." });
    });

    return downloadStream.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Invalid resume id." });
  }
};

const downloadLatestResume = async (_req, res) => {
  try {
    const bucket = getBucket();
    const files = await bucket.find().sort({ uploadDate: -1 }).limit(1).toArray();

    if (!files.length) {
      return res.status(404).json({ message: "Resume not found." });
    }

    const file = files[0];
    res.setHeader("Content-Type", file.contentType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );

    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.on("error", (error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to download resume." });
    });

    return downloadStream.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export { uploadResume, downloadResumeById, downloadLatestResume };
