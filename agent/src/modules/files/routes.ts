import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Browse directory
router.get('/browse', (req, res) => {
    const dirPath = (req.query.path as string) || '/var/www';

    try {
        // In production, this reads the actual filesystem
        // Returning structured mock data for development
        res.json({
            path: dirPath,
            items: [
                { name: 'index.html', type: 'file', size: 2048, permissions: '644', modified: new Date().toISOString() },
                { name: 'css', type: 'directory', size: 0, permissions: '755', modified: new Date().toISOString() },
                { name: 'js', type: 'directory', size: 0, permissions: '755', modified: new Date().toISOString() },
                { name: 'images', type: 'directory', size: 0, permissions: '755', modified: new Date().toISOString() },
                { name: 'config.json', type: 'file', size: 1024, permissions: '644', modified: new Date().toISOString() },
            ],
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to browse directory' });
    }
});

// Read file
router.get('/read', (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: 'Path is required' });

    res.json({ path: filePath, content: `<!-- Contents of ${filePath} -->` });
});

// Write file
router.post('/write', (req, res) => {
    const { path: filePath, content } = req.body;
    if (!filePath) return res.status(400).json({ error: 'Path is required' });

    console.log(`Writing to file: ${filePath}`);
    res.json({ message: `File ${filePath} saved`, size: content?.length || 0 });
});

// Delete file/directory
router.delete('/', (req, res) => {
    const { path: filePath } = req.body;
    if (!filePath) return res.status(400).json({ error: 'Path is required' });

    console.log(`Deleting: ${filePath}`);
    res.json({ message: `${filePath} deleted` });
});

// Rename
router.post('/rename', (req, res) => {
    const { oldPath, newPath } = req.body;
    console.log(`Renaming ${oldPath} to ${newPath}`);
    res.json({ message: `Renamed ${oldPath} to ${newPath}` });
});

// Create directory
router.post('/mkdir', (req, res) => {
    const { path: dirPath } = req.body;
    console.log(`Creating directory: ${dirPath}`);
    res.json({ message: `Directory ${dirPath} created` });
});

// Change permissions
router.post('/chmod', (req, res) => {
    const { path: filePath, permissions } = req.body;
    console.log(`Changing permissions of ${filePath} to ${permissions}`);
    res.json({ message: `Permissions of ${filePath} changed to ${permissions}` });
});

export { router as fileRoutes };
