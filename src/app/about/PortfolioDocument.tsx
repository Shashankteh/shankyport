import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a font for a clean editorial look
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FAF8F5',
    padding: 40,
    fontFamily: 'Inter',
    color: '#1A1A1A'
  },
  header: {
    marginBottom: 40,
    textAlign: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  bioSection: {
    marginBottom: 30,
    lineHeight: 1.5,
    fontSize: 12
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1 solid #E5E2DC',
    paddingTop: 15,
    marginBottom: 40
  },
  detailCol: {
    flex: 1
  },
  detailLabel: {
    fontSize: 9,
    color: '#8A8A8A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  detailValue: {
    fontSize: 11
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center'
  },
  photoWrapper: {
    width: '45%',
    height: 300,
    marginBottom: 15
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

export default function PortfolioDocument({ profile, photos }: { profile: any, photos: any[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{profile.name}</Text>
          <Text style={styles.subtitle}>Model Portfolio</Text>
        </View>

        <View style={styles.bioSection}>
          <Text>{profile.bio}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Height</Text>
            <Text style={styles.detailValue}>{profile.height || 'N/A'}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{profile.location || 'N/A'}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Instagram</Text>
            <Text style={styles.detailValue}>@{profile.instagram || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.photoGrid}>
          {photos.map((photo, i) => (
            <View key={i} style={styles.photoWrapper}>
              <Image src={photo.image_url} style={styles.photo} />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
