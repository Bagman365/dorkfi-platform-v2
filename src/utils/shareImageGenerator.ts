export interface ShareImageData {
  tokenSymbol: string;
  tokenImagePath: string;
  transactionType: 'Deposit' | 'Borrow' | 'Repay' | 'Liquidation';
  amount: string;
  markPrice: string;
  leftData?: { label: string; value: string }[];
  rightData?: { label: string; value: string }[];
}

export const generateShareImage = async (data: ShareImageData): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Load template image
    const templateImg = new Image();
    templateImg.crossOrigin = 'anonymous';
    templateImg.onload = () => {
      // Draw template
      ctx.drawImage(templateImg, 0, 0, 1080, 1920);

      // Load token image
      const tokenImg = new Image();
      tokenImg.crossOrigin = 'anonymous';
      tokenImg.onload = () => {
        // Draw token image at 660px down, 110px from left, 120px square
        ctx.drawImage(tokenImg, 110, 660, 120, 120);

        // Draw token name (centered with token image)
        ctx.font = 'bold 100px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(data.tokenSymbol, 260, 740); // Vertically centered at ~720 (660+60)

        // Draw transaction type and amount at 900px down
        const transactionText = `${data.transactionType} Amount`;
        ctx.font = 'bold 200px Arial';
        ctx.fillStyle = '#d2aa49';
        ctx.fillText(data.amount, 110, 1100);

        // Draw mark price at 1500px down
        ctx.font = 'bold 60px Arial';
        ctx.fillStyle = '#b1b3c2';
        ctx.fillText(`Mark Price: ${data.markPrice}`, 110, 1500);

        // Draw left data section starting at 1325
        if (data.leftData) {
          ctx.font = 'bold 40px Arial';
          ctx.fillStyle = '#ffffff';
          data.leftData.forEach((item, index) => {
            const yPos = 1325 + (index * 80);
            ctx.fillText(item.label, 130, yPos);
            ctx.fillText(item.value, 130, yPos + 40);
          });
        }

        // Draw right data section starting at 1575
        if (data.rightData) {
          ctx.font = 'bold 40px Arial';
          ctx.fillStyle = '#ffffff';
          data.rightData.forEach((item, index) => {
            const yPos = 1575 + (index * 80);
            ctx.fillText(item.label, 770, yPos);
            ctx.fillText(item.value, 770, yPos + 40);
          });
        }

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate blob'));
          }
        }, 'image/png');
      };

      tokenImg.onerror = () => reject(new Error('Failed to load token image'));
      tokenImg.src = data.tokenImagePath;
    };

    templateImg.onerror = () => reject(new Error('Failed to load template image'));
    templateImg.src = '/lovable-uploads/share-template.png';
  });
};
